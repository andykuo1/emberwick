varying highp vec2 v_texcoord;
varying highp vec3 v_light;

uniform sampler2D u_sampler;

void main()
{
  highp vec2 texcoord = v_texcoord;
  highp vec4 texelColor = texture2D(u_sampler, texcoord);
  gl_FragColor = vec4(texelColor.rgb * v_light, texelColor.a);
}
