import { mount, VueWrapper } from "@vue/test-utils";
import App from "../src/App.vue";
import { AccountGatewayFake, AccountGatewayHttp } from "../src/infra/gateway/AccountGateway";
import { AxiosAdapter } from "../src/infra/http/HttpClient";

let wrapper: VueWrapper;

beforeEach(() => {
    wrapper = mount(App, {
        global: {
            provide: {
                accountGateway: new AccountGatewayHttp(new AxiosAdapter())
            }
        }
    });
});

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

test("Deve testar o fluxo de navegação do wizard", async function () {
    expect(wrapper.get(".span-step").text()).toBe("Step 1");
    await wrapper.get(".input-is-passenger").setValue(true);
    expect(wrapper.find(".button-previous").exists()).toBe(false);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("Step 2");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("Step 3");
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    expect(wrapper.find(".button-next").exists()).toBe(false);
    await wrapper.get(".button-previous").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("Step 2");
    await wrapper.get(".button-previous").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("Step 1");
});

test("Deve testar o preenchimento do wizard", async function () {
    expect(wrapper.get(".span-progress").text()).toBe("0%");
    await wrapper.get(".input-is-passenger").setValue(true);
    expect(wrapper.get(".span-progress").text()).toBe("25%");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-name").setValue("John Doe");
    expect(wrapper.get(".span-progress").text()).toBe("45%");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    expect(wrapper.get(".span-progress").text()).toBe("65%");
    await wrapper.get(".input-cpf").setValue("97456321558");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("asdQWE123");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".input-confirm-password").setValue("21345678");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    expect(wrapper.get(".span-progress").text()).toBe("100%");
});

test("Deve testar a visibilidade do wizard", async function () {
    expect(wrapper.find(".input-is-passenger").exists()).toBe(true);
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    expect(wrapper.find(".input-password").exists()).toBe(false);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    expect(wrapper.find(".input-name").exists()).toBe(true);
    expect(wrapper.find(".input-email").exists()).toBe(true);
    expect(wrapper.find(".input-cpf").exists()).toBe(true);
    expect(wrapper.find(".input-password").exists()).toBe(false);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    expect(wrapper.find(".input-password").exists()).toBe(true);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(true);
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
});

test("Deve testar as mensagens de erro do wizard", async function () {
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o tipo de conta");
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o nome");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o email");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o cpf");
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha a senha");
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha a confirmação da senha");
    await wrapper.get(".input-confirm-password").setValue("12345678");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("As senhas devem ser iguais");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.find(".span-error").exists()).toBe(false);
});

test("Deve testar a interação com o backend do wizard", async function () {
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    await sleep(200);
    expect(wrapper.get(".span-success").text()).toBe("OK");
});
