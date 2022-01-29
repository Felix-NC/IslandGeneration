#version 400
layout(location = 0) in vec4 position;
uniform mat4 matrix;
out vec4 pos;
void main()
{
	pos = position;
	gl_Position = matrix * position;
}