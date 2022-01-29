#version 400
#define MAX_LIGHTS 8

//Light information.
struct Light
{
	int type;
	vec4 ambient_intensity;
	vec4 diffuse_intensity;
	vec4 specular_intensity;
	vec4 position;
	vec3 direction;
	float spotlight_falloff;
	float spotlight_inner_cos;
	float spotlight_outer_cos;
	float const_attenuation;
	float linear_attenuation;
	float quadratic_attenuation;
	int soft_factor;
	float bias;
	sampler2D shadow;
};

//Material information.
struct Material
{
	vec4 emission;
	vec4 ambient_coefficient;
	vec4 diffuse_coefficient;
	vec4 specular_coefficient;
	float shininess;
};

in vec2 tex;
in vec3 base_normal;
in vec4 pos;
in vec3 tangent;
in vec3 bitangent;
in vec4 posInLight[MAX_LIGHTS];
out vec4 outputColour;
uniform sampler2D texture1;
uniform sampler2D normal_map;
uniform bool given_tex;
uniform bool given_normal_map;
uniform Light lights[MAX_LIGHTS];
uniform int light_num;
uniform Material material;

//Returns how in shadow pixel is.
float GetShadowFactor(vec3 light_space_pos, int light_num)
{
	float shadow_factor = 0;
	vec2 texelOffset = 1.0 / textureSize(lights[light_num].shadow, 0);
	//Loop through neighbourhood.
	for(int i = -lights[light_num].soft_factor; i <= lights[light_num].soft_factor; i++)
	{
		for(int j = -lights[light_num].soft_factor; j <= lights[light_num].soft_factor; j++)
		{
			vec3 current_pos = light_space_pos + vec3(texelOffset.x * i, texelOffset.y * j,0);
			shadow_factor += (light_space_pos.z - lights[light_num].bias > texture(lights[light_num].shadow, current_pos.xy).r) ? 0.0 : 1.0;
		}
	}
	return shadow_factor/((lights[light_num].soft_factor * 2 + 1) * (lights[light_num].soft_factor * 2 + 1));
}

void main()
{
	vec3 normal;
	if(given_normal_map)
	{
		normal = texture(normal_map,vec2(tex.x, 1 - tex.y)).xyz * 2 - vec3(1.0,1.0,1.0);
		normal = mat3(tangent, bitangent, base_normal) * normal;
	}
	else
	{
		normal = base_normal;
	}
	//Colour to use.
	vec4 nat_colour;
	//Normalised normal.
	vec3 n_normal = normalize(normal);
	//Uses texture or tex coordinates for colour.
	if(given_tex)
	{
		nat_colour = texture(texture1,vec2(tex.x, 1 - tex.y));
	}
	else
	{
		nat_colour = vec4(0.08f,0.26f,0.13f,1.f);
	}
	//Accumulated light.
	vec4 acc_light = vec4(0,0,0,0);
	//Iterates through the lights.
	for(int i = 0; i < light_num; i++)
	{
		//float depth = texture(lights[i].shadow, light_space_pos.xy).r;
		vec4 light_space_pos = posInLight[i] / posInLight[i].w;
		//Distance between light and point.
		float dist = distance(lights[i].position, pos);
		//Attenuation factor.
		float att = min(1/(lights[i].const_attenuation + lights[i].linear_attenuation * dist + lights[i].quadratic_attenuation * dist * dist), 1);
		
		float shadow_value = GetShadowFactor(light_space_pos.xyz, i);
		
		//The direction is the input if directional, if not depends on position.
		vec3 light_dir = (lights[i].type == 1) ? -lights[i].direction : normalize(lights[i].position - pos).xyz;
		//Calculates spotlight factor. Is 1 if being ignored.
		float spotlight = (lights[i].type == 2) ? clamp(pow(((dot(lights[i].direction, -light_dir)-lights[i].spotlight_outer_cos)/(lights[i].spotlight_inner_cos - lights[i].spotlight_outer_cos)),lights[i].spotlight_falloff),0,1) : 1;
		//Ambient light.
		vec4 light_tot = lights[i].ambient_intensity * material.ambient_coefficient;
		//Diffuse light.
		light_tot += shadow_value * spotlight * lights[i].diffuse_intensity * material.diffuse_coefficient * max(dot(n_normal, light_dir),0);
		//Specular light.
		light_tot += shadow_value * spotlight * lights[i].specular_intensity * material.specular_coefficient * pow(max(dot(2 * dot(n_normal, light_dir) * n_normal - light_dir, normalize(-pos).xyz),0), material.shininess);
		//Applies attenuation.
		acc_light += att * clamp(light_tot, vec4(0,0,0,0), vec4(1,1,1,1));
	}
	//Applies emission and light to the natural colour.
	outputColour = nat_colour * (material.emission + acc_light);
}