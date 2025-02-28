import React, { useState, useEffect } from "react";

const LevelManagement = () => {
  const [projects, setProjects] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/index/products/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchIssueTypes = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/index/projects/${selectedProject}/issue-types`);
          const data = await response.json();
          setIssueTypes(data);
          setRequestTypes([]); // Reset request types
        } catch (error) {
          console.error("Error fetching issue types:", error);
        }
      };
      fetchIssueTypes();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedIssueType) {
      const fetchRequestTypes = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/index/issue-types/${selectedIssueType}/request-types`);
          const data = await response.json();
          setRequestTypes(data);
        } catch (error) {
          console.error("Error fetching request types:", error);
        }
      };
      fetchRequestTypes();
    }
  }, [selectedIssueType]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Level Management</h1>

      <div className="space-y-4">
        {/* Project Dropdown */}
        <div className="flex flex-col">
          <label className="mb-2">
            <strong>Project:</strong>
          </label>
          <select
            className="border p-2 rounded"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedIssueType(""); // Reset selected issue type
            }}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.product_code} value={project.product_code}>
                {project.product_name}
              </option>
            ))}
          </select>
        </div>

        {/* Issue Type Dropdown */}
        <div className="flex flex-col">
          <label className="mb-2">
            <strong>Issue Type:</strong>
          </label>
          <select
            className="border p-2 rounded"
            value={selectedIssueType}
            onChange={(e) => setSelectedIssueType(e.target.value)}
            disabled={!selectedProject}
          >
            <option value="">Select Issue Type</option>
            {issueTypes.map((issue) => (
              <option key={issue.issue_type_id} value={issue.issue_type_id}>
                {issue.issue_type}
              </option>
            ))}
          </select>
        </div>

        {/* Request Type Dropdown */}
        <div className="flex flex-col">
          <label className="mb-2">
            <strong>Request Type:</strong>
          </label>
          <select
            className="border p-2 rounded"
            disabled={!selectedIssueType}
          >
            <option value="">Select Request Type</option>
            {requestTypes.map((request) => (
              <option key={request.request_type_id} value={request.request_type_id}>
                {request.request_type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LevelManagement;
