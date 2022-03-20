/** @format */

import Quiz from "../items/Quiz";

export default function TestList({ quizzes }) {
	return quizzes?.length > 0 ? (
		<div className='mb-3 grid grid-cols-1 gap-1'>
			{quizzes.map((quiz) => (
				<Quiz key={quiz.id} quiz={quiz} />
			))}
		</div>
	) : (
		<h1>Sin tests :(</h1>
	);
}
