import { mat4 } from "gl-matrix"
import vertexShader from "./shader.vert?raw"
import fragmentShader from "./shader.frag?raw"
import { createShader, createProgram } from "./shader"

export async function main() {

  const vertices = [
    -1, 0, 0,
    1, 0, 0,
    -1, 0.2, 0,
    1, 0.2, 0,
    -1, 0.4, 0,
    1, 0.4, 0,
    -1, 0.6, 0,
    1, 0.6, 0,
    -1, 0.8, 0,
    1, 0.8, 0,
  ]
  const indices = [
    0, 1, 3,
    0, 3, 2,
    2, 3, 5,
    2, 5, 4,
    4, 5, 7,
    4, 7, 6,
    6, 7, 9,
    6, 9, 8
  ]

  const width = 600
  const height = 400
  const fov = Math.PI / 4
  const aspect = width / height
  const near = 0.1
  const far = 10

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  document.body.appendChild(canvas)
  const gl = canvas.getContext("webgl")!

  const projectionMatrix = mat4.perspective(
    mat4.identity(mat4.create()),
    fov,
    aspect,
    near,
    far,
  )
  const viewMatrix = mat4.lookAt(
    mat4.identity(mat4.create()),
    [0, 0, -4],
    [0, 0, 0],
    [0, 1, 0]
  )
  const modelMatrix = mat4.identity(mat4.create())
  mat4.translate(modelMatrix, modelMatrix, [0, 0, 0])
  mat4.scale(modelMatrix, modelMatrix, [1, 1, 1])

  const modelViewProjectionMatrix = mat4.identity(mat4.create())
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix)
  mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix)

  const program = createProgram(gl, createShader(gl, gl.VERTEX_SHADER, vertexShader), createShader(gl, gl.FRAGMENT_SHADER, fragmentShader))
  const mvpLocation = gl.getUniformLocation(program, "uMvpMatrix")
  const positionLocation = gl.getAttribLocation(program, "aPosition")

  gl.useProgram(program)
  gl.uniformMatrix4fv(mvpLocation, false, modelViewProjectionMatrix)

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  async function process() {
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    )
    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    requestAnimationFrame(process)
  }
  requestAnimationFrame(process)
}
main()
