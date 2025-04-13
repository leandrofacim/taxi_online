import SignupForm from "../src/entity/SignupForm";

test("Deve testar o fluxo de navegação do wizard", async function () {
    const form = new SignupForm();
    expect(form.step).toBe(1);
    form.isPassenger = true;
    expect(form.getProgress()).toBe(25);
    form.next();
    expect(form.step).toBe(2);
    form.name = "John Doe";
    expect(form.getProgress()).toBe(45);
    form.email = `john.doe${Math.random()}@gmail.com`;
    expect(form.getProgress()).toBe(65);
    form.cpf = "97456321558";
    expect(form.getProgress()).toBe(85);
    form.next();
    expect(form.step).toBe(3);
    form.password = "asdQWE123";
    form.confirmPassword = "asdQWE123";
    expect(form.getProgress()).toBe(100);
});

test("Deve testar as mensagens de erro do wizard", async function () {
    const form = new SignupForm();
    form.next();
    expect(form.error).toBe("Preencha o tipo de conta");
    form.isPassenger = true;
    form.next();
    form.next();
    expect(form.error).toBe("Preencha o nome");
    form.name = "John Doe";
    form.next();
    expect(form.error).toBe("Preencha o email");
    form.email = `john.doe${Math.random()}@gmail.com`;
    form.next();
    expect(form.error).toBe("Preencha o cpf");
    form.cpf = "97456321558";
    form.next();
    form.confirm();
    expect(form.error).toBe("Preencha a senha");
    form.password = "asdQWE123";
    form.confirm();
    expect(form.error).toBe("Preencha a confirmação da senha");
    form.confirmPassword = "12345678";
    form.confirm();
    expect(form.error).toBe("As senhas devem ser iguais");
    form.confirmPassword = "asdQWE123";
    form.confirm();
});
