#version 400

in vec4 pos;
in vec2 tex;
in vec3 base_normal;
out vec4 outputColour;
uniform samplerCube cubemap;
uniform sampler2D texture1;
uniform bool given_tex;
uniform vec3 cam_pos;
uniform float refraction_factor;

subroutine void Mode();
subroutine uniform Mode mode;

subroutine(Mode) void Reflect()
{
	vec3 light = normalize(cam_pos-pos.xyz);
	vec3 normalized_n = normalize(base_normal);
	vec3 reflected = 2 * normalized_n * dot(normalized_n, light) - light;
	outputColour = texture(cubemap,reflected);
}

subroutine(Mode) void Refract()
{
	vec3 light = normalize(cam_pos-pos.xyz);
	vec3 normalized_n = normalize(base_normal);
	vec3 refracted = (refraction_factor * dot(normalized_n, light) - sqrt(1 - pow(refraction_factor,2) * (1 - pow(dot(normalized_n,light),2)))) * normalized_n - refraction_factor * light;
	outputColour = texture(cubemap, refracted);
}

subroutine(Mode) void None()
{
	if(given_tex)
	{
		outputColour = texture(texture1,vec2(tex.x, 1 - tex.y));
	}
	else
	{
		outputColour = vec4(tex.x, tex.y, 0.0f, 1.0f);
	}
}

void main()
{
	/*vec3 light = normalize(cam_pos-pos.xyz);
	vec3 normalized_n = normalize(base_normal);
	vec3 reflected_vec = 2 * normalized_n * dot(normalized_n, light) - light;
	outputColour = texture(cubemap,reflected_vec);*/
	mode();
}