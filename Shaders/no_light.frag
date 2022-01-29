#version 400
#define MAX_LIGHTS 8

in vec2 tex;
in vec3 base_normal;
in vec4 pos;
out vec4 outputColour;
uniform sampler2D texture1;
uniform bool given_tex;
uniform int draw_mode;

void main()
{
	switch(draw_mode)
	{
		case 1:
		outputColour = vec4(base_normal,1);
		return;
		default:
		break;
	}
	//Normalised normal.
	vec3 n_normal = normalize(base_normal);
	//Uses texture or tex coordinates for colour.
	if(given_tex)
	{
		outputColour = texture(texture1,vec2(tex.x, 1 - tex.y));
	}
	else
	{
		outputColour = vec4(tex.x, tex.y, 0.0f, 1.0f);
	}
}