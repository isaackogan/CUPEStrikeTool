import {Component} from "react";
import styled from "styled-components";
import CourseSelect from "./CourseSelect";
import StrikeResults from "./StrikeResults";
import SectionSelect from "./SectionSelect";
import {SubHeader} from "../Home";

const StrikeFormContainer = styled.div`
  width: 100%;
  margin-bottom: 75px;
`;

type IStrikeState = {
    searches: number | null;
    animatedSearches: number | null;
}

const SearchCount = styled.div`
  font-size: 12px;
  font-weight: normal;
  margin-top: 15px;

  animation: 1000ms fadein;
`;

export default class StrikeForm extends Component<any, IStrikeState> {

    private didMount = false;
    state = {searches: null, animatedSearches: 0};

    async componentDidMount() {
        if (this.didMount) return;
        this.didMount = true;
        setInterval(this.updateStats.bind(this), 1000 * 5);
        setInterval(this.tickAnimation.bind(this), 50);
        await this.updateStats();
    }

    async tickAnimation() {
        if (!this.state.searches) return;
        if (this.state.animatedSearches >= this.state.searches) return;
        this.setState({...this.state, animatedSearches: this.state.animatedSearches + 1});
    }

    async updateStats() {
        let res: Response = await fetch("https://yorkapi.isaackogan.com/v1/main/cst/stats");
        let json: {navs: number | null} = await res.json();
        let animatedSearches = !this.state.animatedSearches ? Math.floor(json.navs * 9.8/10) : this.state.animatedSearches;
        this.setState({...this.state, searches: json.navs, animatedSearches: animatedSearches});
    }

    getSearchesText() {
        if (this.state.searches == null || !this.state.animatedSearches) return <></>;
        return (
            <SearchCount>
            A total of {(this.state.animatedSearches as number)?.toLocaleString()} searches have been performed.
            </SearchCount>
        )
    }
    render() {
        return (
            <StrikeFormContainer>
                <SubHeader>
                    Course Search
                    {this.getSearchesText()}
                </SubHeader>
                <CourseSelect />
                <SectionSelect />
                <StrikeResults />
            </StrikeFormContainer>
        )
    }

}
