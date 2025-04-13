import Observable from "./Observable";

export default class SignupForm extends Observable {
    step = 1;
    isPassenger = false;
    name = "";
    email = "";
    cpf = "";
    password = "";
    confirmPassword = "";
    success = "";
    error = "";

    constructor () {
        super();
    }
    

    next () {
		if (this.validate()) {
			this.step++;
		}
	}

	previous () {
		this.step--;
	}

    async confirm () {
        if (this.validate()) {
            const event = {
                isPassenger: this.isPassenger,
                name: this.name,
                email: this.email,
                cpf: this.cpf,
                password: this.password
            };
            this.notify("confirmed", event);
        }
    }

    validate () {
		this.error = "";
		if (this.step === 1) {
			if (!this.isPassenger) {
				this.error = "Preencha o tipo de conta";
				return false;
			}
		}
		if (this.step === 2) {
			if (!this.name) {
				this.error = "Preencha o nome";
				return false;
			}
			if (!this.email) {
				this.error = "Preencha o email";
				return false;
			}
			if (!this.cpf) {
				this.error = "Preencha o cpf";
				return false;
			}
		}
		if (this.step === 3) {
			if (!this.password) {
				this.error = "Preencha a senha";
				return false;
			}
			if (!this.confirmPassword) {
				this.error = "Preencha a confirmação da senha";
				return false;
			}
			if (this.password !== this.confirmPassword) {
				this.error = "As senhas devem ser iguais";
				return false;
			}
		}
		return true;
	}

    getProgress () {
		let progress = 0;
		if (this.isPassenger) {
			progress += 25;
		}
		if (this.name) {
			progress += 20;
		}
		if (this.email) {
			progress += 20;
		}
		if (this.cpf) {
			progress += 20;
		}
		if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
			progress += 15;
		}
		return progress;
	}

    fill () {
		this.isPassenger = true;
		this.name = "John Doe";
		this.email = `john.doe${Math.random()}@gmail.com`;
		this.cpf = "97456321558";
		this.password = "asdQWE123";
		this.confirmPassword = "asdQWE123";
	}
}