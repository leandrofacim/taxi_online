<script setup lang="ts">
	import { ref, inject } from "vue";
	import AccountGateway, { AccountGatewayHttp } from "./infra/gateway/AccountGateway";
	import SignupForm from "./entity/SignupForm";

	const accountGateway = inject("accountGateway") as AccountGateway;

	let form = ref(new SignupForm());

	form.value.register("confirmed", async function (event: any) {
		await accountGateway.signup(event);
		form.value.success = "OK";
	});
	
</script>

<template>
	<div>
		<div>
			<button class="button-fill" @click="form.fill()">Fill</button>
		</div>
		<div>
			<span class="span-step">Step {{ form.step }}</span>
		</div>
		<div>
			<span class="span-progress">{{ form.getProgress() }}%</span>
		</div>
		<div>
			<span v-if="form.success" class="span-success">{{ form.success }}</span>
		</div>
		<div>
			<span v-if="form.error" class="span-error">{{ form.error }}</span>
		</div>
		<div v-if="form.step === 1">
			<div>
				<input class="input-is-passenger" type="checkbox" v-model="form.isPassenger"/>
			</div>
		</div>
		<div v-if="form.step === 2">
			<div>
				<input class="input-name" type="text" v-model="form.name" placeholder="Name"/>
			</div>
			<div>
				<input class="input-email" type="text" v-model="form.email" placeholder="Email"/>
			</div>
			<div>
				<input class="input-cpf" type="text" v-model="form.cpf" placeholder="Cpf"/>
			</div>
		</div>
		<div v-if="form.step === 3">
			<div>
				<input class="input-password" type="text" v-model="form.password" placeholder="Password"/>
			</div>
			<div>
				<input class="input-confirm-password" type="text" v-model="form.confirmPassword" placeholder="Confirm password"/>
			</div>
		</div>
		<div>
			<button v-if="form.step > 1" class="button-previous" @click="form.previous()">Previous</button>
			<button v-if="form.step < 3" class="button-next" @click="form.next()">Next</button>
			<button v-if="form.step === 3" class="button-confirm" @click="form.confirm()">Confirm</button>
		</div>
	</div>
</template>

<style>
</style>
