const constraints = {
    audio: true,
    video: {
        width: 1920,
        height: 1080
    }
};
const mediaSource = new MediaSource();
let mediaRecorder;
let storedBlob;
let sourceBuffer;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');

/* To initiate/stop recording on click */
$(recordButton).click(function() {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        $("#record").removeClass("stopRecord").addClass("startRecord");
        playButton.disabled = false;
    }
});

/* To play recorded video on click */
const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
    $("#recorded").css("display", "inline-block")
    const superBuffer = new Blob(storedBlob, {
        type: 'video/webm'
    });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
    $(".modContent").text('Hurrah !! Your recorded video is playing in the second video panel').fadeIn().delay(2500).fadeOut();
});

/* Check the data */
function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        storedBlob.push(event.data);
    }
}
/* To start recording */
function startRecording() {
    $("#record").removeClass("startRecord").addClass("stopRecord");
    storedBlob = [];
    mediaRecorder = new MediaRecorder(window.stream);
    recordButton.textContent = 'Stop Recording';
    $(".modContent").text('First Step is done !! Your video is started recording').fadeIn().delay(2500).fadeOut();
    playButton.disabled = true;
    mediaRecorder.onstop = (event) => {};
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
}

/* To stop recording */
function stopRecording() {
    mediaRecorder.stop();
    $(".modContent").text('Please, click on play to review it').fadeIn().delay(1500).fadeOut();
}

/* Bring the video capture by checking stream */
function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const mirrorVideo = document.querySelector('video#mirror');
    mirrorVideo.srcObject = stream;
}

/* Check for constraints */
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Check constraints" + JSON.stringify(constraints));
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `Please Check whether Microphone and/or WebCam is working properly. The error is ${e.toString()}`;
    }
}

init();