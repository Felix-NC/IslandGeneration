#version 400

in vec4 pos;
out vec4 outputColour;
uniform samplerCube texture1;
uniform bool given_tex;

void main()
{
	//Uses texture or tex coordinates for colour.
	if(given_tex)
	{
		//vec3 position = (pos / max(pos.x, max(pos.y, pos.z))).xyz;
		outputColour = texture(texture1,pos.xyz);
	}
	else
	{
		outputColour = vec4(pos.x, pos.y, pos.z, 1.0f);
	}
}