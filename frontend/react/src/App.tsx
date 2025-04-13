import { useState } from "react";
import SignupForm from "./SignupForm";

function App() {
	const [form, setForm] = useState(new SignupForm());

	function reload (fn: any) {
		if (fn) fn();
		setForm(clone(form));
	}

	return (
		<div>
			<div>
				<button className="button-fill" onClick={() => reload(() => form.fill() ) }>Fill</button>
			</div>
			<div>
				<span className="span-step">{ form.step }</span>
			</div>
			<div>
				<span className="span-progress">{ form.getProgress() }%</span>
			</div>
			<div>
				<span className="span-success">{ form.success }</span>
			</div>
			<div>
				<span className="span-error">{ form.error }</span>
			</div>
			{ form.step === 1 && <div>
				<input className="input-is-passenger" type="checkbox" checked={form.isPassenger} onChange={(e) => reload(() => form.isPassenger = e.target.checked ) } />
			</div> }
			{ form.step === 2 && <div>
				<input className="input-name" value={form.name} onChange={(e) => reload(() => form.name = e.target.value ) }/>
				<input className="input-email" value={form.email} onChange={(e) => reload(() => form.email = e.target.value ) }/>
				<input className="input-cpf" value={form.cpf} onChange={(e) => reload(() => form.cpf = e.target.value ) }/>
			</div> }
			{ form.step === 3 && <div>
				<input className="input-password" value={form.password} onChange={(e) => reload(() => form.password = e.target.value ) }/>
				<input className="input-confirm-password" value={form.confirmPassword} onChange={(e) => reload(() => form.confirmPassword = e.target.value ) }/>
			</div> }
			<div>
				{ form.step > 1 && <button className="button-previous" onClick={() => reload(() => form.previous() ) }>Previous</button> }
				{ form.step < 3 && <button className="button-next" onClick={() => reload(() => form.next() ) }>Next</button> }
				{ form.step === 3 && <button className="button-confirm" onClick={() => reload(() => form.confirm() ) }>Confirm</button> }
			</div>
		</div>
	)
}

function clone(obj: any) {
	var copy = new obj.constructor;
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

export default App
