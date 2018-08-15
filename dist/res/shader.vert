attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

varying highp vec3 v_normal;
varying highp vec2 v_texcoord;

void main()
{
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
  v_normal = a_normal;
  v_texcoord = a_texcoord;
}
