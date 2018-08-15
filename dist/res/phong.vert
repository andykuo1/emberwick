attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_normal;

varying highp vec2 v_texcoord;
varying highp vec3 v_light;

void main()
{
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
  v_texcoord = a_texcoord;

  //Apply lighting
  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionLight = vec3(1, 1, 1);
  highp vec3 directionVector = normalize(vec3(0.85, 0.8, 0.75));

  highp vec4 transformedNormal = u_normal * vec4(a_normal, 1.0);
  highp float dir = max(dot(transformedNormal.xyz, directionVector), 0.0);
  v_light = ambientLight + (directionLight * dir);
}
