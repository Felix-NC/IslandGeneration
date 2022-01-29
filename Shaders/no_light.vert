#version 400
#define MAX_LIGHTS 8
layout(location = 0) in vec4 position;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normals;
uniform mat4 toCamMatrix;
uniform mat4 matrix;
out vec2 tex;
out vec3 base_normal;
out vec4 pos;
void main()
{
	tex = texcoord;
	pos = toCamMatrix * position;
	//Calculates normal in camera space.
	base_normal = normalize((inverse(transpose(toCamMatrix)) * vec4(normals,0)).xyz);
	
	gl_Position = matrix * position;
}