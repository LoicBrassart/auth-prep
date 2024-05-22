import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { FormEvent } from "react";

class NewUserInput {
  mail!: string;
  password!: string;
}

const LOGIN = gql`
  query Login($data: NewUserInput!) {
    login(data: $data)
  }
`;
const SIGNUP = gql`
  mutation CreateUser($data: NewUserInput!) {
    createUser(data: $data)
  }
`;

export default function LoginForm() {
  const [login, { loading: loginLoading, error: loginError, data: loginData }] =
    useLazyQuery(LOGIN);
  const [
    signup,
    { loading: signupLoading, error: signupError, data: signupData },
  ] = useMutation(SIGNUP);

  const hSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log(values);

    const input = new NewUserInput();
    input.mail = values.mail as string;
    input.password = values.password as string;
    if (values["action"] === "Login") {
      const apiAnswer = await login({ variables: { data: input } });
      localStorage.setItem("token", apiAnswer.data.login);
    } else {
      signup({ variables: { data: input } });
    }
  };

  return (
    <form onSubmit={hSubmit}>
      <input type="text" name="mail" defaultValue="" placeholder="mail" />
      <input
        type="password"
        name="password"
        defaultValue=""
        placeholder="password"
      />
      <label>
        <input type="radio" name="action" value="Login" />
        Login
      </label>
      <label>
        <input type="radio" name="action" value="Signup" defaultChecked />
        Signup
      </label>
      <button>Submit</button>
    </form>
  );
}
