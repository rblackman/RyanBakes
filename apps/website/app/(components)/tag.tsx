import Link from 'next/link';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import 'server-only';
import styles from './(styles)/tag.module.css';

interface Props {
	tag: string;
}

export default function Tag({ tag }: Props) {
	return (
		<li key={tag} className={styles.tagListItem}>
			<Link className={styles.tagLink} href={`/tags/${tag.replace(' ', '-')}`}>
				<BiPurchaseTagAlt className={styles.tagLink_Svg} />
				<span className={styles.tagLink_Tag}> {tag}</span>
			</Link>
		</li>
	);
}
