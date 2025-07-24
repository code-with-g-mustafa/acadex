export type Resource = {
  id: string;
  university: string;
  department: string;
  semester: string;
  subject: string;
  title: string;
  description: string;
  fileType: 'Note' | 'Past Paper' | 'Lab Manual';
  fileUrl: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  summary: string;
  shortNotes: string;
  content: string;
};

const universities = ['University of Technology', 'City College'];
const departments = ['Computer Science', 'Electrical Engineering'];
const semesters = ['1st', '2nd', '3rd', '4th'];
const subjects = {
  'Computer Science': ['Introduction to Programming', 'Data Structures', 'Algorithms'],
  'Electrical Engineering': ['Circuit Theory', 'Digital Logic Design', 'Signals and Systems'],
};

const resources: Resource[] = [
  {
    id: '1',
    university: 'University of Technology',
    department: 'Computer Science',
    semester: '2nd',
    subject: 'Data Structures',
    title: 'Comprehensive Notes on Linked Lists',
    description: 'Detailed notes covering singly, doubly, and circular linked lists with code examples.',
    fileType: 'Note',
    fileUrl: '/placeholder.pdf',
    tags: ['linked lists', 'data structures', 'notes'],
    status: 'approved',
    summary: 'This document provides an in-depth exploration of linked lists, a fundamental data structure in computer science. It covers the theory and implementation of singly, doubly, and circular linked lists, supplemented with practical code examples in Python.',
    shortNotes: 'Singly linked lists allow traversal in one direction.\nDoubly linked lists have pointers to both next and previous nodes.\nCircular linked lists form a circle.',
    content: `An Introduction to Linked Lists. A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers. In simple words, a linked list consists of nodes where each node contains a data field and a reference(link) to the next node in the list. Types of Linked Lists: Singly Linked List: Each node stores a reference to the next node. Doubly Linked List: Each node stores a reference to the next node and a reference to the previous node. Circular Linked List: The last node points back to the first node, forming a circle. This document explains all three in detail.`
  },
  {
    id: '2',
    university: 'University of Technology',
    department: 'Computer Science',
    semester: '2nd',
    subject: 'Data Structures',
    title: 'Past Paper - Midterm Exam 2023',
    description: 'The official midterm exam paper for the Data Structures course from Spring 2023.',
    fileType: 'Past Paper',
    fileUrl: '/placeholder.pdf',
    tags: ['exam', 'midterm', '2023'],
    status: 'approved',
    summary: 'This document is the Spring 2023 midterm examination paper for the Data Structures course. It includes questions on arrays, stacks, queues, and linked lists, designed to test the students\' theoretical understanding and problem-solving skills.',
    shortNotes: 'Covers arrays, stacks, queues, and linked lists.\nTotal marks: 50.\nDuration: 2 hours.',
    content: `Data Structures Midterm Exam - Spring 2023. Question 1: Explain the difference between an array and a linked list. Provide one scenario where an array is more suitable and one where a linked list is better. (10 marks). Question 2: Write pseudocode to implement a queue using two stacks. (15 marks). Question 3: Reverse a singly linked list. You may not use extra space. (15 marks). Question 4: What is stack overflow? How can it be prevented? (10 marks).`
  },
  {
    id: '3',
    university: 'City College',
    department: 'Electrical Engineering',
    semester: '3rd',
    subject: 'Digital Logic Design',
    title: 'Lab Manual - Logic Gates',
    description: 'Lab manual for the experiment on basic and universal logic gates.',
    fileType: 'Lab Manual',
    fileUrl: '/placeholder.pdf',
    tags: ['lab', 'logic gates', 'dld'],
    status: 'approved',
    summary: 'This lab manual outlines the procedure for an experiment on logic gates. It provides instructions for verifying the truth tables of basic gates (AND, OR, NOT) and universal gates (NAND, NOR) using integrated circuits.',
    shortNotes: 'Objective: Verify truth tables of logic gates.\nApparatus: ICs 7408, 7432, 7404, 7400, 7402.\nIncludes pre-lab and post-lab questions.',
    content: `Experiment 1: Verification of Logic Gates. Objective: To study and verify the truth tables of basic logic gates and universal gates. Theory: Logic gates are the basic building blocks of any digital system. They are electronic circuits having one or more than one input and only one output. The relationship between the input and the output is based on a certain logic. Based on this, logic gates are named as AND gate, OR gate, NOT gate etc. Procedure: 1. Connect the VCC and ground to the respective pins of the IC. 2. Apply the input combinations and observe the output. 3. Verify the truth table for each gate. Conclusion: The truth tables for all logic gates have been verified.`
  },
];

export const addResource = (resource: Omit<Resource, 'id' | 'status' | 'summary' | 'shortNotes' | 'content' | 'tags' | 'fileUrl'>) => {
    const newResource: Resource = {
        ...resource,
        id: (resources.length + 1).toString(),
        status: 'pending',
        summary: 'AI summary is being generated...',
        shortNotes: 'AI notes are being generated...',
        content: 'Dummy content for now.',
        tags: resource.title.toLowerCase().split(' ').slice(0,3),
        fileUrl: '/placeholder.pdf',
    };
    resources.push(newResource);
    return newResource;
}

export const getResources = (filters?: { [key: string]: string }) => {
  if (!filters) return resources;
  return resources.filter(resource => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      if (key === 'searchQuery') {
        return resource.title.toLowerCase().includes(value.toLowerCase()) || resource.description.toLowerCase().includes(value.toLowerCase());
      }
      return resource[key as keyof Resource] === value;
    });
  });
};

export const getResourceById = (id: string) => {
  return resources.find(resource => resource.id === id);
};

export const getFilters = () => ({
  universities,
  departments,
  semesters,
  subjects,
});