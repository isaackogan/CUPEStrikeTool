import Header from "../../Header";
import styled from "styled-components";
import StrikeForm from "./Form/StrikeForm";


export const SubHeader = styled.h2`
  font-size: 24px;
`;

const DescriptionBox = styled.div`
  margin: 25px 5% 0 5%;
`;

const PLink = styled.a`
  text-decoration: underline;
  color: black;

  &:hover {
    color: #545454;
  }

  &:active {
    color: #868686;
  }
`;


export default function Home() {

    return (
        <div>
            <Header />
            <DescriptionBox>
                <SubHeader>About</SubHeader>
                <p>
                    At the moment, there is a chance of a&nbsp;
                    <PLink href={"https://3903.cupe.ca/"} target={"_blank"}>CUPE 3903</PLink> strike
                    starting this Mon, Feb 26th, 2024. This tool cross-references the CUPE member list with current courses to inform you if your course will be affected.
                    &nbsp;Please use this <strong>only as an advisement</strong> and understand this is <strong>not</strong> a York University tool. This was
                    student-made to help other students navigate this confusing time.
                </p>
                <p>
                    Please watch your inbox as your professors will reach out to communicate information daily.
                </p>
                <StrikeForm />
            </DescriptionBox>
        </div>
    )
}