import {Component} from "react";
import {sectionSelectEvent, SectionSelectEventDetail} from "./SectionSelect";
import {CourseSchedule, CourseScheduleSection} from "./CourseSelect";
import styled from "styled-components";
import {SubHeader} from "../Home";
import members from "../../../../assets/members.json";

type IStrikeResultsState = {
    section?: string,
    schedule?: CourseSchedule
}

const NoResultsMessage = styled.span`
  color: #575757;
`;

type IProps = {};
export default class StrikeResults extends Component<IProps, IStrikeResultsState> {

    private cupeMembers: string[] = members;
    private hasMounted = false;
    state: IStrikeResultsState = {};

    componentDidMount() {
        if (this.hasMounted) return;
        this.hasMounted = true;
        document.addEventListener(sectionSelectEvent, this.onCourseScheduleUpdate.bind(this));
    }

    async onCourseScheduleUpdate(event: Event) {
        const detail: SectionSelectEventDetail = (event as CustomEvent).detail;
        if (detail === null) {
            this.setState({...this.state, schedule: undefined, section: undefined});
            return;
        }

        this.setState({...this.state, schedule: detail.schedule, section: detail.section});
        await this.searchStatTick();
    }

    async searchStatTick() {
        try {
            await fetch("https://yorkapi.isaackogan.com/v1/main/cst/stats", {method: "POST"})
        } catch (ex) {
            console.log('failed to update stats')
        }
    }

    render() {

        return (
            <div>
                <SubHeader>Search Results</SubHeader>
                {this.getSearchResults()}
            </div>
        )
    }

    getSearchResults() {

        if (!this.state.section && !this.state.schedule) {
            return <NoResultsMessage>Search something to get results...</NoResultsMessage>
        }

        const sectionData: CourseScheduleSection | undefined = this.state.schedule?.sections[this.state.section || ""];
        if (!sectionData) {
            return <NoResultsMessage>Section Not Found...</NoResultsMessage>
        }

        if (!this.hasProfs(sectionData)) {
            return <NoResultsMessage>Section Profs Not Found...</NoResultsMessage>
        }

        const hasLab = this.hasType(sectionData, "LAB");
        const hasTutorial = this.hasType(sectionData, "TUTR");
        const cupeMembers = this.getCUPEMembers(sectionData);
        const cupeProfs = this.getCUPEProfs(sectionData);
        const nonCupeProfs = this.getNonCUPEProfs(sectionData);

        console.log("CUPE Members:", cupeMembers);
        console.log("CUPE Profs:", cupeProfs);
        console.log("Non-CUPE Profs:", nonCupeProfs);

        if (cupeMembers.length > 0) {
            return <>
               You will likely be affected.
                <br/>
                <ul>
                    <li> There are <strong>{cupeMembers.length} CUPE instructor(s)</strong> for your course section!</li>
                    {hasLab && <li>Your course has labs which will <strong>not</strong> run in-person during a strike.</li>}
                    {hasTutorial && <li>Your course has tutorials. If those tutorials involve TAs, they <strong>may be affected</strong>.</li>}
                    <li>{this.getCupeProfMessage(cupeProfs, nonCupeProfs)}</li>
                    <li>Non-CUPE instructors will alter the delivery mode of courses to remote instruction if they see fit.</li>
                    <li>Courses and academic activities in progress that can continue will continue.</li>
                    <li>YUFA professors may choose not to cross picket lines so their courses might also be impacted.</li>
                    <li>Courses won’t have non-YUFA graders which is likely to impact all courses.</li>
                </ul>
            </>
        } else {
            return <>
                You will likely not be affected. But, if you are:
                <ul>
                    <li>Non-CUPE instructors will alter the delivery mode of courses to remote instruction if they see fit.</li>
                    <li>Courses and academic activities in progress that can continue will continue.</li>
                    <li>YUFA professors may choose not to cross picket lines so their courses might also be impacted.</li>
                    <li>Courses won’t have non-YUFA graders which is likely to impact all courses.</li>
                </ul>
            </>
        }

    }

    getCupeProfMessage(cupeProfs: string[], nonCupeProfs: string[]) {
        if (cupeProfs.length < 1) {
            return <>Your section's lecture is likely <strong>not</strong> taught by a CUPE member and may be less affected.</>
        }
        else if (cupeProfs.length > 0 && nonCupeProfs.length < 1) {
            return (
                <>Your section's lecture is taught by <strong>{cupeProfs.length} CUPE instructor(s)</strong> and may be affected.</>
            )
        }
        else {
            return (
                <>Your section's lecture is taught by <strong>{cupeProfs.length} CUPE instructor(s)</strong> and <strong>{nonCupeProfs.length} non-CUPE instructor(s)</strong>. It <strong>may or may not</strong> be affected.</>
            )
        }
    }

    hasType(sectionSchedule: CourseScheduleSection, courseType: string): boolean {
        for (let sectionClass of sectionSchedule.classes) {
            if (sectionClass.type === courseType) {
                return true;
            }
        }
        return false;
    }

    hasProfs(sectionSchedule: CourseScheduleSection): boolean {
        let profCount = 0;
        for (const classSchedule of sectionSchedule.classes) {
            profCount += classSchedule.instructors.length;
        }
        return profCount > 0;
    }

    getCUPEMembers(sectionSchedule: CourseScheduleSection): string[] {
        const cupeList = new Set();
        for (const classSchedule of sectionSchedule.classes) {
            for (const instructor of classSchedule.instructors) {
                if (this.cupeMembers.includes(instructor)) {
                    cupeList.add(instructor)
                }
            }
        }

        return Array.from(cupeList) as string[];
    }

    getCUPEProfs(sectionSchedule: CourseScheduleSection): string[] {
        const cupeList: Set<string> = new Set();
        for (const classSchedule of sectionSchedule.classes) {
            if (classSchedule.type !== "LECT" && classSchedule.type !== "SEMR") {
                continue;
            }
            for (const instructor of classSchedule.instructors) {
                if (this.cupeMembers.includes(instructor)) {
                    cupeList.add(instructor)
                }
            }
        }
        return Array.from(cupeList as Set<string>) as string[];
    }

    getNonCUPEProfs(sectionSchedule: CourseScheduleSection): string[] {
        const nonCupeList: Set<string> = new Set();
        for (const classSchedule of sectionSchedule.classes) {
            if (classSchedule.type !== "LECT" && classSchedule.type !== "SEMR") {
                continue;
            }
            for (const instructor of classSchedule.instructors) {
                if (!this.cupeMembers.includes(instructor)) {
                    nonCupeList.add(instructor)
                }
            }
        }
        return Array.from(nonCupeList as Set<string>) as string[];
    }


}
