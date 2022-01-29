#version 400

out vec4 outputColour;
in vec2 texcoords;
uniform sampler2D texture1;
uniform float contrast;
void main()
{
	outputColour = texture(texture1, vec2(texcoords.x, texcoords.y)).rrrr;
	//Hardcoded contrast.
	outputColour = (outputColour - vec4(contrast, contrast, contrast, contrast))/(1 - contrast);
}