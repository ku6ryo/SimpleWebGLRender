precision mediump float;
varying vec4 pos;

void main() {
  gl_FragColor = vec4(pos.z, 0, 0, 1.);
}