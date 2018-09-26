varying highp vec2 v_texcoord;

uniform sampler2D u_sampler;

uniform highp vec2 u_texoffset;
uniform highp vec2 u_texscale;

void main()
{
  gl_FragColor = texture2D(u_sampler, (v_texcoord / u_texscale) + u_texoffset);
}
