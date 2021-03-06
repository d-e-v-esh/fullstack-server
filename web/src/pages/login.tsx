import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
interface registerProps {}
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          // The keys line up exactly with the values so we don't need to specify each one => username => username && password => password
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data?.login.errors)); // if errors occurred
          } else if (response.data?.login.user) {
            // if we found a user then send it to the homepage or the page where the user was before logging in
            if (typeof router.query.next === "string") {
              // if we set the next field in useIsAuth then it is going to be string.
              // if router.query.next is a string then we will push to that path

              router.push(router.query.next);
            } else {
              // if we did not set the next field in useIsAuth then it is going to be undefined.
              // if the next field is undefine then we will push to the homepage
              router.push("/");
            }
          }
        }}>
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="username or email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Flex>
                <NextLink href="/forgot-password">
                  <Link ml="auto">forgot password?</Link>
                </NextLink>
              </Flex>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}>
                login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
