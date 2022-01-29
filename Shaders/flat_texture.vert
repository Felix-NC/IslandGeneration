#version 400
layout(location = 0) in vec4 position;
layout(location = 1) in vec2 uvs;
uniform mat4 matrix;
out vec2 texcoords;
void main()
{
	texcoords = uvs;
	gl_Position = matrix * position;
}