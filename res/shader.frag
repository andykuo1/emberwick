varying highp vec2 v_texcoord;

uniform sampler2D u_sampler;

uniform highp vec2 u_texoffset;
uniform highp vec2 u_texscale;

void main()
{
  highp vec2 texcoord = v_texcoord;
  //Flip y-coords since origin for OpenGL is bottom left
  texcoord.y = 1.0 - texcoord.y;
  gl_FragColor = texture2D(u_sampler, (texcoord / u_texscale) + u_texoffset);
}
