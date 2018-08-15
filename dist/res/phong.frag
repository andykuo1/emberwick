varying vec2 v_texcoord;
varying vec3 v_light;

uniform sampler2D u_sampler;

void main()
{
  vec4 texelColor = texture2D(u_sampler, v_texcoord);
  gl_FragColor = vec4(texelColor.rgb * v_light, texelColor.a);
}
