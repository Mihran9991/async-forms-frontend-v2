import React, { useEffect, useState } from "react";
import { Avatar, Spin, Popover, List } from "antd";
import { If, Then, Else } from "react-if";

import { getActiveUsersList } from "../../services/request/userService";

function ActiveUserList({ vertical }) {
  const [activeUserList, setActiveUserList] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  let prev = 1;

  useEffect(() => {
    const getData = async () => {
      setIsSpinning(true);
      const {
        data: { activeUsersList: list },
      } = await getActiveUsersList();
      setIsSpinning(false);

      setActiveUserList(list);
    };

    getData();
  }, []);

  return (
    <Spin spinning={isSpinning}>
      <If condition={vertical}>
        <Then>
          <List
            dataSource={activeUserList}
            renderItem={(item) => (
              <List.Item key={item.uuid}>
                <List.Item.Meta
                  avatar={
                    <If condition={item.pictureUrl}>
                      <Then>
                        <Avatar src={item.pictureUrl} />
                      </Then>
                      <Else>
                        <Avatar style={{ fontSize: "medium" }}>
                          {item.name[0]}
                        </Avatar>
                      </Else>
                    </If>
                  }
                  title={
                    <a
                      href="https://ant.design"
                      style={{ color: "red !important" }}
                    >
                      {item.name}
                    </a>
                  }
                  description={item.email}
                />
                <div>Content</div>
              </List.Item>
            )}
          />
        </Then>
        <Else>
          <ul
            style={{
              color: "#fff",
              display: "inline-flex",
              listStyleType: "none",
              float: "right",
              marginRight: "12em",
            }}
          >
            {activeUserList.map(({ pictureUrl, name }, idx) => {
              const right = prev + 6;
              prev = right;

              return (
                <Popover content={name}>
                  <li
                    key={idx}
                    style={{
                      position: "relative",
                      right: `${right}px`,
                      cursor: "pointer",
                    }}
                  >
                    <If condition={pictureUrl}>
                      <Then>
                        <Avatar src={pictureUrl} />
                      </Then>
                      <Else>
                        <Avatar style={{ fontSize: "medium" }}>
                          {name[0]}
                        </Avatar>
                      </Else>
                    </If>
                  </li>
                </Popover>
              );
            })}
          </ul>
        </Else>
      </If>
    </Spin>
  );
}

export default ActiveUserList;
