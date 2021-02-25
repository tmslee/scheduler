import React from "react";

import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";
import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import axios from "../../__mocks__/axios";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes schedule when a new day is selected", () => {
    const {getByText} = render(<Application />);
  
    return waitForElement(() => getByText("Monday"))
    .then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  
  it("loads data, books an interview and reduces spots remaining for first day by 1", async () => {
    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases spots remaining for monday by 1", async () => {
    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => queryByAltText(appointment, "Add"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Lydia Miller-Jones"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Thomas Lee"}
    })
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Thomas Lee"));
    expect(getByText(appointment, "Thomas Lee")).toBeInTheDocument();
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async() => {
    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Thomas Lee"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => queryByText(appointment, "Error"));
    expect(getByText(appointment, "Error during saving, please try again")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    const {container, debug} = render(<Application />);

    await waitForElement(() => getByText(container, "Thomas Lee"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByAltText(appointment, "Delete"));
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement(() => queryByText(appointment, "Error"));
    expect(getByText(appointment, "Error during deleting, please try again")).toBeInTheDocument();
  });

});