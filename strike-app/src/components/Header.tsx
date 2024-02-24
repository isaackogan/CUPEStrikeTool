import {Component} from "react";
import styled from "styled-components";

interface IHeaderProps {}
interface IHeaderState {}

const HeaderContainer = styled.div`
  width: 100%;
`;

const HeaderTitle = styled.div`
  color: #ffffff;
  font-weight: 400;
  font-size: 20px;
  padding: 15px 5% 15px 5%; // Subscript forces top to be slightly underrepresented
  background: #545454;
`;

const ButtonContainer = styled.div`
  background: #363636;
  height: 40px;
  padding-left: 5%;
  padding-right: 5%;
  display: flex;
  justify-content: left;

`;

const Button = styled.a`
  font-size: 17px;
  color: white;
  height: 100%;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  
  @media(max-width: 1000px) {
    text-align: center;
    padding: 0 10px;
  }
  @media(max-width: 1000px) {
    font-size: 15px;
  }
  @media(max-width: 700px) {
    font-size: 12px;
  }
  
  &:hover {
    background-color: #000000;
  }
`;

export default class Header extends Component<IHeaderProps, IHeaderState> {

    constructor(props: IHeaderProps) {
        super(props);
    }

    render() {
        return (
            <HeaderContainer>
                <HeaderTitle>
                    CUPE 3903 Strike Tool
                    <div style={{fontSize: "13px"}}>Student-Made for Students</div>
                </HeaderTitle>
                <ButtonContainer>
                    <Button target="_blank" href={"https://3903.cupe.ca/"}>CUPE 3903</Button>
                    <Button target="_blank" href={"https://www.yufa.ca/potential_strike_by_cupe_3903_2024"}>YUFA Statement</Button>
                    <Button target="_blank" href={"https://www.yorku.ca/secretariat/policies/policies/academic-implications-of-disruptions-or-cessations-of-university-business-due-to-labour-disputes-or-other-causes-senate-policy-on-the/"}>Senate Policy</Button>
                    <Button target="_blank" href={"https://www.reddit.com/r/yorku/search/?q=strike&restrict_sr=1&t=month&sort=new"}>Reddit Discussion</Button>
                </ButtonContainer>
            </HeaderContainer>
        );
    }

}

