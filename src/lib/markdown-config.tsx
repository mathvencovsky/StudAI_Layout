import rehypeHighlight from "rehype-highlight";
import { Options as ReactMarkdownOptions } from "react-markdown";

const OrderedList = ({
  children,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement> & {
  children?: React.ReactNode;
}) => (
  <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
    {children}
  </ol>
);

const UnorderedList = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement> & { children?: React.ReactNode }) => (
  <ul className="list-disc list-inside space-y-1 my-2" {...props}>
    {children}
  </ul>
);

const ListItem = ({
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }) => (
  <li className="ml-2" {...props}>
    {children}
  </li>
);

export const markdownConfig: ReactMarkdownOptions = {
  rehypePlugins: [rehypeHighlight],
  components: {
    ol: OrderedList,
    ul: UnorderedList,
    li: ListItem,
  },
};
