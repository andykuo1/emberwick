attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_modelview;
uniform mat4 u_projection;

varying highp vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_modelview * a_position;
  v_texcoord = a_texcoord;
}
