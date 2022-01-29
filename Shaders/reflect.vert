#version 400
layout(location = 0) in vec4 position;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normals;
uniform mat4 matrix;
uniform mat4 toWorldMatrix;
out vec4 pos;
out vec2 tex;
out vec3 base_normal;
void main()
{
	tex = texcoord;
	base_normal = normalize((inverse(transpose(toWorldMatrix)) * vec4(normals,0)).xyz);
	pos = toWorldMatrix * position;
	gl_Position = matrix * position;
}