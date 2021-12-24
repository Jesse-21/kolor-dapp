import { useShowAlert } from "../../../hooks";
import { Post } from "../../../types";
import styles from "./PostStub.module.css";
import { LazyLoadImage, ScrollPosition } from "react-lazy-load-image-component";
import Chain from "../../PostImage/Chain/Chain";

const PostStub: React.FC<{
	post: Post;
	scrollPosition: ScrollPosition;
	className?: string;
}> = ({ post, scrollPosition, className }) => {
	const showAlert = useShowAlert();

	// 3 days - ( the difference between now and the date the post was created )
	let timeLeft =
		3 * 24 * 60 * 60 - Math.floor((+new Date() - +post.timestamp) / 1000);
	const [days, hours, minutes] = formatTimeLeft(timeLeft);

	let isAudioPost = post.contentType?.startsWith("audio/");

	async function handleDeletePost() {
		showAlert(
			"Please allow up to 6 minutes for your post to be deleted.",
			"info"
		);
	}

	return (
		<div className={[styles.container, className].join(" ")}>
			<div className={styles.text}>{post.text}</div>
			<div className={styles.mediaContent}>
				{!isAudioPost && post.file && post.file.startsWith("p.deso") && (
					<LazyLoadImage
						alt=""
						effect="blur"
						src={"https://" + post.file}
						className={styles.mediaContent}
						scrollPosition={scrollPosition}
					/>
				)}
				{isAudioPost && post.file && (
					<audio controls>
						<source src={"https://" + post.file} />
						Your browser does not support the audio element.
					</audio>
				)}
			</div>
			<div className={styles.bottomPostContainer}>
				{timeLeft > 0 && !post.removed && (
					<>
						<div className={styles.deleteButtonContainer}>
							<button onClick={handleDeletePost}>Remove post</button>
						</div>
						<div className={styles.timeAdded}>
							Time left to remove: {days} {days === 1 ? "day" : "days"} {hours}{" "}
							{hours === 1 ? "hour" : "hours"} {minutes}{" "}
							{minutes === 1 ? "minute" : "minutes"}
						</div>
					</>
				)}
				{timeLeft <= 0 && !post.removed && (
					<div className={styles.timeAdded}>
						It's too late for this post to be removed.
					</div>
				)}
				{post.removed && (
					<div className={styles.timeAdded}>
						This post has already been removed.
					</div>
				)}

				<div className={styles.chain}>
					<Chain blockchain={post.chainid} />
				</div>
			</div>
		</div>
	);
};

export default PostStub;

function formatTimeLeft(timeLeft: number) {
	let days = 0;
	let hours = 0;
	let minutes = 0;

	while (timeLeft >= 60 * 60 * 24) {
		timeLeft -= 60 * 60 * 24;
		days++;
	}

	while (timeLeft >= 60 * 60) {
		timeLeft -= 60 * 60;
		hours++;
	}

	while (timeLeft >= 60) {
		timeLeft -= 60;
		minutes++;
	}

	return [days, hours, minutes];
}
