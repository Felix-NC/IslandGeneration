#version 400
#define MAX_LIGHTS 8
layout(location = 0) in vec4 position;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normals;
layout(location = 3) in vec3 tangents;
layout(location = 4) in vec3 bitangents;
uniform mat4 toCamMatrix;
uniform mat4 matrix;
uniform mat4 toLightSpace[MAX_LIGHTS];
uniform int light_num;
out vec2 tex;
out vec3 base_normal;
out vec4 pos;
out vec3 tangent;
out vec3 bitangent;
out vec4 posInLight[MAX_LIGHTS];
void main()
{
	tex = texcoord;
	pos = toCamMatrix * position;
	//Calculates normal in camera space.
	base_normal = normalize((inverse(transpose(toCamMatrix)) * vec4(normals,0)).xyz);
	tangent = normalize((toCamMatrix * vec4(tangents,0)).xyz);
	bitangent = normalize((toCamMatrix * vec4(bitangents,0)).xyz);
	
	for(int i = 0; i < light_num; i++)
	{
		posInLight[i] = toLightSpace[i] * position;
	}
	
	gl_Position = matrix * position;
}