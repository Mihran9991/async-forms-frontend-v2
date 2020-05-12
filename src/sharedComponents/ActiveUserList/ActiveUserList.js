import React, { useEffect, useState } from "react";
import { Avatar, Spin, Popover, List } from "antd";
import { If, Then, Else } from "react-if";
import { withRouter } from "react-router-dom";

import { getActiveUsersList } from "../../services/request/userService";
import routeConstants from "../../constants/routeConstants";

function ActiveUserList({ vertical, history }) {
  const [activeUserList, setActiveUserList] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const displayActiveUsersCount = 1;
  let prev = 1;

  useEffect(() => {
    const getData = async () => {
      setIsSpinning(true);
      try {
        const {
          data: { activeUsersList: list },
        } = await getActiveUsersList();

        setActiveUserList(list);
      } catch (e) {
        console.log("err", e);
      } finally {
        setIsSpinning(false);
      }
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
            {(activeUserList.length < displayActiveUsersCount
              ? activeUserList
              : activeUserList.slice(0, displayActiveUsersCount)
            ).map(({ pictureUrl, name }, idx) => {
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
            {activeUserList.length > displayActiveUsersCount && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  history.push(
                    `${routeConstants.DASHBOARD}${routeConstants.ACTIVE_USERS}`
                  );
                }}
              >
                More
              </span>
            )}
          </ul>
        </Else>
      </If>
    </Spin>
  );
}

export default withRouter(ActiveUserList);
