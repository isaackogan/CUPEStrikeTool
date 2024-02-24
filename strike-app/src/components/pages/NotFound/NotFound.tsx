import Header from "../../Header";
import styled from "styled-components";
import {Button} from "@mui/material";


const DescriptionBox = styled.div`
  margin: 2% 5% 0 5%;

  @media(max-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
`;

const YeoImage = styled.img`
  width: 100%;
  margin-left: 25px;
  margin-bottom: -35px;
  filter: grayscale(1) contrast(1.5);
`;

const YeoContainer = styled.div`
  width: 70%;
  max-width: 300px;
  margin-top: 20px;
`;

export default function NotFound() {

    return (
        <>
            <Header />
            <DescriptionBox>
                <h2>404 Page Not Found</h2>
                The page you navigated to does not exist.
                <YeoContainer>
                    <YeoImage src={"./yeo.gif"} />
                    <Button
                        variant={"contained"}
                        style={{height: "45px", width: "100%", marginTop: "15px",}}
                        onClick={() => window.location.href = "/"}>
                        Return Home
                    </Button>
                </YeoContainer>
            </DescriptionBox>
        </>
    )
}
