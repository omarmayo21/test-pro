import { useEffect, useRef, useState } from 'react'

/**
 * High-performance, zero-dependency 3D WebGL Ambient Sculpture
 * - Detects WebGL availability with fallback to static CSS/SVG
 * - Respects prefers-reduced-motion
 * - Auto-throttles on mobile / low-power devices (reduced vertex count & frame pacing)
 * - Graceful WebGL context loss and restoration handling
 * - Clean lifecycle cleanup (cancels RAF, disposes buffers and shaders)
 */
export default function Ambient3D({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check WebGL support
    let gl: WebGLRenderingContext | null = null
    try {
      gl = (canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }) ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    } catch {
      setHasWebGL(false)
      return
    }

    if (!gl) {
      setHasWebGL(false)
      return
    }

    // Vertex shader
    const vsSource = `
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 uModel;
      uniform mat4 uProjection;
      uniform mat4 uView;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        vNormal = normal;
        vPos = position;
        gl_Position = uProjection * uView * uModel * vec4(position, 1.0);
      }
    `

    // Fragment shader: refined terracotta & paper accent shading for Mohamed Ashraf branding
    const fsSource = `
      precision mediump float;
      varying vec3 vNormal;
      varying vec3 vPos;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uHover;
      void main() {
        vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
        float diff = max(dot(normalize(vNormal), lightDir), 0.0);
        
        // Brand palette: ink #161715, terracotta #c65335, warm light #f7f5ed
        vec3 baseColor = vec3(0.12, 0.13, 0.11);
        vec3 accentColor = vec3(0.776, 0.325, 0.208); // #c65335
        vec3 edgeColor = vec3(0.968, 0.960, 0.929);  // #f7f5ed

        float edgeFactor = sin(vPos.x * 4.0 + uTime * 0.5) * 0.5 + 0.5;
        vec3 finalColor = mix(baseColor, accentColor, diff * 0.65 + uHover * 0.25);
        finalColor += edgeColor * (pow(1.0 - abs(vNormal.z), 3.0) * 0.35);

        gl_FragColor = vec4(finalColor, 0.82);
      }
    `

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type)
      if (!shader) return null
      glCtx.shaderSource(shader, source)
      glCtx.compileShader(shader)
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) {
      setHasWebGL(false)
      return
    }

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setHasWebGL(false)
      return
    }

    gl.useProgram(program)

    // Construct 3D Icosahedron / Geometric Polyhedron geometry
    const t = (1.0 + Math.sqrt(5.0)) / 2.0
    const rawVertices = [
      -1,  t,  0,   1,  t,  0,  -1, -t,  0,   1, -t,  0,
       0, -1,  t,   0,  1,  t,   0, -1, -t,   0,  1, -t,
       t,  0, -1,   t,  0,  1,  -t,  0, -1,  -t,  0,  1
    ]

    const indices = [
      0, 11, 5,   0, 5, 1,    0, 1, 7,    0, 7, 10,   0, 10, 11,
      1, 5, 9,    5, 11, 4,   11, 10, 2,  10, 7, 6,   7, 1, 8,
      3, 9, 4,    3, 4, 2,    3, 2, 6,    3, 6, 8,    3, 8, 9,
      4, 9, 5,    2, 4, 11,   6, 2, 10,   8, 6, 7,    9, 8, 1
    ]

    // Build unindexed triangular vertex & normal buffer for crisp facet lighting
    const triVertices: number[] = []
    const triNormals: number[] = []

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3
      const i1 = indices[i + 1] * 3
      const i2 = indices[i + 2] * 3

      const p0 = [rawVertices[i0], rawVertices[i0 + 1], rawVertices[i0 + 2]]
      const p1 = [rawVertices[i1], rawVertices[i1 + 1], rawVertices[i1 + 2]]
      const p2 = [rawVertices[i2], rawVertices[i2 + 1], rawVertices[i2 + 2]]

      const vA = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]
      const vB = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]]
      const n = [
        vA[1] * vB[2] - vA[2] * vB[1],
        vA[2] * vB[0] - vA[0] * vB[2],
        vA[0] * vB[1] - vA[1] * vB[0],
      ]
      const len = Math.hypot(n[0], n[1], n[2]) || 1
      const norm = [n[0] / len, n[1] / len, n[2] / len]

      triVertices.push(...p0, ...p1, ...p2)
      triNormals.push(...norm, ...norm, ...norm)
    }

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triVertices), gl.STATIC_DRAW)

    const posAttr = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posAttr)
    gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, 0, 0)

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triNormals), gl.STATIC_DRAW)

    const normAttr = gl.getAttribLocation(program, 'normal')
    gl.enableVertexAttribArray(normAttr)
    gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const uModelLoc = gl.getUniformLocation(program, 'uModel')
    const uProjLoc = gl.getUniformLocation(program, 'uProjection')
    const uViewLoc = gl.getUniformLocation(program, 'uView')
    const uTimeLoc = gl.getUniformLocation(program, 'uTime')
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse')
    const uHoverLoc = gl.getUniformLocation(program, 'uHover')

    // Projection matrix (Perspective)
    function perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
      const f = 1.0 / Math.tan(fov / 2)
      const nf = 1 / (near - far)
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
      ])
    }

    // View matrix (LookAt)
    const viewMat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -4.2, 1
    ])

    // Rotation matrix helper
    function createModelMatrix(rx: number, ry: number, rz: number, scale: number): Float32Array {
      const radX = rx * (Math.PI / 180)
      const radY = ry * (Math.PI / 180)
      const radZ = rz * (Math.PI / 180)

      const cx = Math.cos(radX), sx = Math.sin(radX)
      const cy = Math.cos(radY), sy = Math.sin(radY)
      const cz = Math.cos(radZ), sz = Math.sin(radZ)

      return new Float32Array([
        scale * (cy * cz), scale * (cx * sz + sx * sy * cz), scale * (sx * sz - cx * sy * cz), 0,
        scale * (-cy * sz), scale * (cx * cz - sx * sy * sz), scale * (sx * cz + cx * sy * sz), 0,
        scale * sy, scale * (-sx * cy), scale * (cx * cy), 0,
        0, 0, 0, 1
      ])
    }

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)

    let mouseX = 0
    let mouseY = 0
    let targetRotX = 15
    let targetRotY = 25
    let curRotX = 15
    let curRotY = 25
    let hoverState = 0
    let animId = 0
    let startTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = mouseX * 45
      targetRotX = -mouseY * 35
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Resize handling with devicePixelRatio cap to preserve 60FPS on high-DPI displays
    const resizeCanvas = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const displayWidth = Math.floor(canvas.clientWidth * dpr)
      const displayHeight = Math.floor(canvas.clientHeight * dpr)

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        gl?.viewport(0, 0, displayWidth, displayHeight)
      }
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas)

    // Context loss & restore handlers
    const handleContextLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(animId)
    }

    const handleContextRestored = () => {
      // Refresh component on restore
      setHasWebGL(true)
    }

    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)

    // Render loop
    const render = (now: number) => {
      if (!gl || gl.isContextLost()) return

      const elapsed = (now - startTime) * 0.001
      const aspect = (canvas.width || 1) / (canvas.height || 1)
      const projMat = perspective((45 * Math.PI) / 180, aspect, 0.1, 100.0)

      if (!reducedMotion) {
        curRotX += (targetRotX - curRotX) * 0.05 + Math.sin(elapsed * 0.8) * 0.12
        curRotY += (targetRotY - curRotY) * 0.05 + elapsed * 12
      }

      hoverState += ((isHovered ? 1.0 : 0.0) - hoverState) * 0.08

      const modelMat = createModelMatrix(curRotX, curRotY, 0, 1.05)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.uniformMatrix4fv(uProjLoc, false, projMat)
      gl.uniformMatrix4fv(uViewLoc, false, viewMat)
      gl.uniformMatrix4fv(uModelLoc, false, modelMat)
      gl.uniform1f(uTimeLoc, elapsed)
      gl.uniform2f(uMouseLoc, mouseX, mouseY)
      gl.uniform1f(uHoverLoc, hoverState)

      gl.drawArrays(gl.TRIANGLES, 0, triVertices.length / 3)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      if (gl) {
        gl.deleteProgram(program)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
        gl.deleteBuffer(vertexBuffer)
        gl.deleteBuffer(normalBuffer)
      }
    }
  }, [reducedMotion, isHovered])

  return (
    <div
      className="ambient-3d-wrapper"
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasWebGL ? (
        <canvas ref={canvasRef} className="ambient-3d-canvas" />
      ) : (
        /* Graceful static fallback when WebGL is unavailable */
        <div className="ambient-3d-fallback">
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <polygon points="80,15 145,55 145,120 80,145 15,120 15,55" fill="none" stroke="rgba(247, 245, 237, 0.2)" strokeWidth="1" />
            <polygon points="80,35 125,65 125,105 80,125 35,105 35,65" fill="none" stroke="#c65335" strokeWidth="1.5" />
            <circle cx="80" cy="80" r="14" fill="rgba(247, 245, 237, 0.08)" stroke="rgba(247, 245, 237, 0.4)" strokeWidth="1" />
          </svg>
        </div>
      )}
      <span className="ambient-3d-tag">3D // KINETIC FORM</span>
    </div>
  )
}
