#version 400
layout(location = 0) in vec4 position;
layout(location = 1) in vec4 col;
uniform mat4 matrix;
out vec4 colour;
void main()
{
	colour = col;
	gl_Position = matrix * position;
}