
import { ReactNode } from 'react';
import cx from 'classnames'

import './styles.scss'

type QuestionProps = {
  content: string,
  author: {
    name: string,
    avatar: string
  }
  children?: ReactNode,
  isAnswered?: boolean,
  isHighligthted?: boolean
}
export const Question = ({
  content,
  author,
  children,
  isAnswered = false,
  isHighligthted = false
}: QuestionProps) => {
  return (
    <div className={cx(
      "question",
      { answered: isAnswered },
      { highligthted: isHighligthted && !isAnswered })}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}