import { fireEvent, getByText, render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import App from './App';
import { act } from "react-dom/test-utils";
import userEvent from '@testing-library/user-event'




describe('App', () => {

    beforeEach(() => {
        render(<App />);
    });

    if('Test Render', () => {
        test('rendering and checking necessary elements', () => {
            const firstNameInput = getFirstName()
            expect(firstNameInput).toBeInTheDocument();
          
            const lastNameInput = getLastName()
            expect(lastNameInput).toBeInTheDocument();
          
            const smallDescriptionInput = getSmallDescription()
            expect(smallDescriptionInput).toBeInTheDocument();
          
            const emailInput = getEmail()
            expect(emailInput).toBeInTheDocument();
          
            const addImgBtn = getAddImgBtn()
            expect(addImgBtn).toBeInTheDocument();
            
            const saveBtn = getSaveBtn()
            expect(saveBtn).toBeInTheDocument();
            expect(saveBtn).toBeDisabled();
        });
    }) 

    it('Filling all valid data and click submit.', async () => {
        const firstNameInput = getFirstName();
        const lastNameInput = getLastName();
        const smallDescriptionInput = getSmallDescription();
        const emailInput = getEmail();
        const saveBtn = getSaveBtn();

        await userEvent.type(firstNameInput,'john');
        expect(firstNameInput).toHaveValue('john');

        await userEvent.type(lastNameInput,'doe');
        expect(lastNameInput).toHaveValue('doe');

        await userEvent.type(smallDescriptionInput,'small description');
        expect(smallDescriptionInput).toHaveValue('small description');

        await userEvent.type(emailInput,'johndoe@gmail.com');
        expect(emailInput).toHaveValue('johndoe@gmail.com');

        await waitFor(() => {
            expect(saveBtn).not.toBeDisabled();
        })

        await userEvent.click(saveBtn);

        const uploadModal = getUploadModal();
        await waitFor(() => {
            expect(uploadModal).toBeInTheDocument();
        })

        await waitFor(async () => {
            const sentDialog = getSentDialog();
            expect(sentDialog).toBeInTheDocument();
        }, {timeout: 5000})
      })

      it('Filling all invalid data and not click submit', async () => {
        const firstNameInput = getFirstName();
        const lastNameInput = getLastName();
        const smallDescriptionInput = getSmallDescription();
        const emailInput = getEmail();

        await userEvent.type(firstNameInput,'j');
        await userEvent.keyboard('[Backspace]')
        expect(screen.getByText('First Name is Required')).toBeInTheDocument();

        await userEvent.type(lastNameInput,'d');
        await userEvent.keyboard('[Backspace]')
        expect(screen.getByText('Last Name is Required')).toBeInTheDocument();

        await userEvent.type(smallDescriptionInput,'s');
        await userEvent.keyboard('[Backspace]')
        expect(screen.getByText('Small Description is Required')).toBeInTheDocument();

        await userEvent.type(emailInput,'j');
        expect(screen.getByText('Please enter valid email')).toBeInTheDocument();
        
        await userEvent.type(emailInput,'j');
        await userEvent.keyboard('[Backspace][Backspace]')
        expect(screen.getByText('Email is Required')).toBeInTheDocument();
      })

      it("Uploads the image", async () => {
        const addImgInput = getAddImgInput();
        const file = new File(["john"], "john.png", { type: "image/png" });
        userEvent.upload(addImgInput, file);
        await waitFor(() => {
            expect(screen.getByTestId("img-0")).toBeInTheDocument();
        }, {timeout: 1000})
      })

})

function getFirstName() {
    return within(screen.getByTestId("first-name-input")).getByRole('textbox');
}
function getLastName() {
    return within(screen.getByTestId("last-name-input")).getByRole('textbox');
}
function getSmallDescription() {
    return within(screen.getByTestId("small-description-input")).getByRole('textbox');
}
function getEmail() {
    return within(screen.getByTestId("email-input")).getByRole('textbox');
}
function getAddImgBtn() {
    return screen.getByTestId("add-img-btn");
}
function getSaveBtn() {
    return screen.getByTestId("save-btn");
}
function getUploadModal() {
    return screen.getByTestId('loading-modal')
}
function getSentDialog() {
    return screen.getByTestId('email-sent-dialog')
}

function getAddImgInput() {
    return screen.getByTestId('add-img-input')
}