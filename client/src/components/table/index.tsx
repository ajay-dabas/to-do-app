import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import "./table.css";

type Props = {
  columns: {
    title: string;
    fieldName: string;
    className?: string;
    icons?: string[];
  }[];
  data: {
    _id: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    date: string;
  }[];
  iconClick: (e, icon, id) => void;
};

const Table = ({ columns = [], data = [], iconClick }: Props) => {
  return (
    <div id="todo-table" className="table">
      {data.map((item) => (
        <div key={item._id} className={`table-row table-row-${item.status}`}>
          {columns.map((column) => (
            <div key={column.fieldName} className="table-cell">
              <div className="table-cell--heading">{column.title}</div>
              <div
                className={`table-cell--content ${column.fieldName}-content`}
              >
                {column.fieldName === "date"
                  ? new Date(item.date).toLocaleString()
                  : item[column.fieldName] != null
                    ? item[column.fieldName]
                    : column.icons?.map((icon, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={icons["fa" + icon]}
                          style={{ cursor: "pointer" }}
                          onClick={(e) => iconClick(e, icon, item._id)}
                          size="lg"
                          fixedWidth
                        />
                      ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export { Table };
