import styled from "styled-components";

const Spinner = styled.div`
	border: 8px solid #f3f3f3; /* Light grey */
	border-top: 8px solid #1c4980; /* Spinner Color */
	border-radius: 50%;
	width: 100px;
	height: 100px;
	animation: spin 2s linear infinite;

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const PreloaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background-color: #dff1f1;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
`;

const Preloader = () => {
	return (
        <PreloaderWrapper>
            <Spinner />
        </PreloaderWrapper>
    );
};

export default Preloader;
