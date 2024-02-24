import React, {Component} from "react";
import {Autocomplete, TextField} from "@mui/material";

export type ICourseSelectState = {
    courses: string[],
    value: string | null,
    optionsOpen: boolean
}

export type CourseScheduleClassSchedule = {
    day: string,
    campus: string,
    duration: string,
    room: string,
    time: string
}

export type CourseScheduleClass = {
    category: string,
    instructors: string[],
    meet: string,
    type: string,
    schedule: CourseScheduleClassSchedule[]
}

export type CourseScheduleSection = {
    term: string,
    section: string,
    number: string,
    notes: string,
    language: string,
    credit: string,
    classes: CourseScheduleClass[]
}

export type CourseSchedule = {
    faculty: string,
    subject: string,
    term: string,
    title: string,
    sections: Record<string, CourseScheduleSection>
}


export const courseScheduleEvent = "courseSchedule";

export default class CourseSelect extends Component<any, ICourseSelectState> {

    private hasMounted: boolean = false;
    private session: string = "FW_2023";

    state: ICourseSelectState = {courses: [], value: null, optionsOpen: false};

    async componentDidMount() {
        if (this.hasMounted) return;
        this.hasMounted = true;

        const response: Response = await fetch(`https://yorkapi.isaackogan.com/v1/courses/info/${this.session}/codes`);
        const json: JSON = await response.json();

        this.setState({
            ...this.state, courses: json as unknown as string[]
        });

    }

    async onInputChange(_: React.SyntheticEvent, change: string | null) {

        if (!change) return;

        if (change.length < 4 && this.state.optionsOpen) {
            this.setState({...this.state, optionsOpen: false});
        }

        else if (change.length >= 4 && !this.state.optionsOpen) {
            this.setState({...this.state, optionsOpen: true});
        }

    }

    async onChange(_: React.SyntheticEvent, change: string | null) {

        if (change == null) {
            this.setState({...this.state, value: change, optionsOpen: false});
            this.fetchAndEmitNull();
            return;
        }

        if (!this.state.courses.includes(change)) {
            return;
        }

        this.setState({...this.state, value: change, optionsOpen: false});

        try {
            await this.fetchAndEmitSchedule(change)
        } catch (ex) {
            alert("Failed to retrieve course schedule...")
        }
    }

    fetchAndEmitNull(): void {
        document.dispatchEvent(new CustomEvent(courseScheduleEvent, {detail: null}));
    }

    async fetchAndEmitSchedule(courseCode: string): Promise<void> {

        const response: Response = await fetch(
            `https://yorkapi.isaackogan.com/v1/courses/info/${this.session}/${courseCode}/schedule`
        )

        const json: JSON = await response.json();

        document.dispatchEvent(new CustomEvent(courseScheduleEvent, {
            detail: json as unknown as CourseSchedule})
        );
    }

    onTextFieldInputChange(e: React.SyntheticEvent) {
        const target: HTMLInputElement = (e.target as HTMLInputElement);
        target.value = target.value
            .replace(/ +/g, "-")
            .toUpperCase();
    }

    render() {
        return (
            <>
                <Autocomplete
                    disablePortal
                    id="course-search-input"
                    size={"small"}
                    sx={{width: "300px"}}
                    value={this.state.value}
                    disabled={!(this.state.courses && (this.state?.courses?.length || 0) > 1)}
                    options={this.state.courses || []}
                    onChange={this.onChange.bind(this)}
                    onInputChange={this.onInputChange.bind(this)}
                    onInput={this.onTextFieldInputChange.bind(this)}
                    renderInput={
                        (params) => {
                            return (
                                <TextField
                                    {...params}
                                    label={<span style={{lineHeight: "28px"}}
                                >Course Code</span>} />
                            )
                        }
                    }
                    open={this.state.optionsOpen}
                />
            </>
        )
    }
}
