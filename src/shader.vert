precision mediump float;

attribute vec3 aPosition;

uniform mat4 uMvpMatrix;
varying vec4 pos;

void main() {
  gl_Position = vec4(aPosition, 1.0);
  pos = uMvpMatrix * vec4(aPosition, 1.0);
}