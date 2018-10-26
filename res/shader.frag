varying highp vec2 v_texcoord;

uniform sampler2D u_sampler;

uniform highp vec2 u_texoffset;
uniform highp vec2 u_texscale;

void main()
{
  highp vec2 texcoord = v_texcoord;
  gl_FragColor = texture2D(u_sampler, (texcoord / u_texscale) + u_texoffset);
}
