attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

varying highp vec2 v_texcoord;

void main()
{
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
  v_texcoord = a_texcoord;

  //Just so the compiler does not remove a_normal...
  if (a_normal.x > 0.0) return;
}
