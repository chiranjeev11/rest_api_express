const Joi = require('joi');

const express = require('express');

const app = express();

// to parse JSON object in the body of request
// app.use runs before every request
app.use(express.json())				// Adding a piece of middleware

var courses = [
	{'id':1, 'courseName': 'Programming in C', 'courseDuration': '2'},
	{'id':2, 'courseName': 'Python Programming', 'courseDuration': '2'}
]

app.get('/', (_req, res) => {
	res.send('Hello World');
})

app.get('/api/courses', (req, res) => {
	res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {

	let course = courses.find(course => course.id === parseInt(req.params.id));

	if (!course) res.status(404).send('The course with the given ID was not found.')

	res.send(course);
})

app.post('/api/courses', (req, res) => {

	const result = validateCourse(req.body);

	if (result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}

	let course = {
		'id': courses.length+1,
		'courseName': req.body.courseName,
		'courseDuration': req.body.courseDuration
	}

	courses.push(course);

	res.send(course);
})

app.put('/api/courses/:id', (req, res) => {

	let course = courses.find(course => course.id === parseInt(req.params.id));

	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const result = validateCourse(req.body);

	if (result.error){
		res.status(400).send(result.error.details[0].message);
		return;
	}

	course.courseName = req.body.courseName;
	course.courseDuration = req.body.courseDuration;

	res.send(course);

})

app.delete('/api/courses/:id', (req, res) => {

	let course = courses.find(course => course.id === parseInt(req.params.id));

	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const index = courses.indexOf(course);

	courses.splice(index, 1);

	res.send(course);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})


function validateCourse(body){
	const schema = Joi.object({
		courseName: Joi.string().required().min(3),
		courseDuration: Joi.required()
	})

	return schema.validate(body);
}


