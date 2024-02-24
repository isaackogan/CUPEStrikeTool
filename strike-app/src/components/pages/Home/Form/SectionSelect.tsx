import React, {Component} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {CourseSchedule, courseScheduleEvent} from "./CourseSelect";

type ISectionSelectState = {
    schedule?: CourseSchedule,
    value: string | null,
    optionsOpen: boolean
}

export const sectionSelectEvent = "sectionSelect";

export type SectionSelectEventDetail = {
    section: string,
    schedule: CourseSchedule
}

export default class SectionSelect extends Component<any, ISectionSelectState> {

    private hasMounted = false;
    state: ISectionSelectState = {value: null, optionsOpen: false};

    componentDidMount() {
        if (this.hasMounted) return;
        this.hasMounted = true;
        document.addEventListener(courseScheduleEvent, this.onCourseScheduleUpdate.bind(this));
    }

    onCourseScheduleUpdate(event: Event) {
        document.dispatchEvent(new CustomEvent(sectionSelectEvent, {detail: null}));

        this.setState({
            ...this.state,
            schedule: (event as CustomEvent).detail,
            value: null
        });
    }

    private getSectionNames(): string[] {
        return Object.keys(this.state.schedule?.sections || {});
    }

    async onChange(_: React.SyntheticEvent, change: string | null) {

        if (change == null) {
            this.setState({...this.state, value: change});
            document.dispatchEvent(new CustomEvent(sectionSelectEvent, {detail: null}));
            return;
        }

        if (!this.getSectionNames().includes(change)) {
            return;
        }

        this.setState({...this.state, value: change, optionsOpen: false});
        const eventDetail: SectionSelectEventDetail = {schedule: this.state.schedule as CourseSchedule, section: change};
        document.dispatchEvent(new CustomEvent(sectionSelectEvent, {detail: eventDetail}));
    }

    render() {
        return (
            <>
                <Autocomplete
                    disablePortal
                    id="course-search-input"
                    size={"small"}
                    sx={{width: "300px", marginTop: "15px"}}
                    value={this.state.value}
                    disabled={!(this.state.schedule)}
                    options={this.getSectionNames()}
                    onChange={this.onChange.bind(this)}
                    renderInput={(params) => <TextField {...params} label={<span style={{lineHeight: "28px"}}>Course Section</span>} />}
                />
            </>
        )
    }
}
